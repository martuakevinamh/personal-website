"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Briefcase, ClipboardList, Inbox } from "lucide-react";

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

function ImageSlideshow({ images, alt }: { images: ExperienceImage[]; alt: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-44 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-700">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={`${alt} ${i + 1}`}
          fill
          className={`object-cover transition-opacity duration-600 ${i === idx ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: img.position || "center", transform: `scale(${img.zoom || 1})` }}
          sizes="400px"
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      {images.length > 1 && (
        <>
          <div className="absolute bottom-2 right-2 text-[10px] bg-black/50 text-white/70 px-2 py-0.5 rounded-full">
            {idx + 1}/{images.length}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExpCard({ exp, color, index }: { exp: Experience; color: string; index: number }) {
  const isPresent = !exp.endDate || exp.endDate === "Sekarang";
  return (
    <div className="glass-card p-5 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <ImageSlideshow images={exp.images} alt={exp.organization} />
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className={`font-bold text-sm leading-tight ${color}`}>{exp.title}</h4>
        <span
          className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            isPresent
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-zinc-800 border-zinc-700 text-zinc-500"
          }`}
        >
          {exp.startDate} – {isPresent ? "Now" : exp.endDate}
        </span>
      </div>
      <p className="text-sm text-zinc-300 mb-2 font-medium">{exp.organization}</p>
      {exp.description && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{exp.description}</p>
      )}
    </div>
  );
}

export default function Experience({ experiences }: { experiences: Experience[] }) {
  const [tab, setTab] = useState<"organization" | "committee">("organization");
  if (!experiences) return null;

  const orgs = experiences.filter((e) => e.type === "organization");
  const coms = experiences.filter((e) => e.type === "committee");
  const list = tab === "organization" ? orgs : coms;

  return (
    <section id="experience" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(217,70,239,0.04),transparent)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">Experience</span>
        </h2>
        <p className="section-subtitle">My organizational and committee experience</p>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass rounded-full p-1 flex gap-1">
            {([
              { key: "organization", label: <span className="flex items-center gap-1.5"><Briefcase size={14} /> Organisasi</span>, count: orgs.length },
              { key: "committee",    label: <span className="flex items-center gap-1.5"><ClipboardList size={14} /> Kepanitiaan</span>, count: coms.length },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  tab === key
                    ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label} <span className="opacity-60 text-xs">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {list.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((exp, i) => (
              <ExpCard
                key={exp.id}
                exp={exp}
                index={i}
                color={tab === "organization" ? "text-violet-400" : "text-fuchsia-400"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600 flex flex-col items-center">
            <Inbox size={48} className="mb-4 opacity-50" />
            <p>No {tab} experience listed yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
