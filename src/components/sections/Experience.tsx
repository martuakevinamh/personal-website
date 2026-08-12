"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CrossfadeImage from "@/components/CrossfadeImage";
import { Briefcase, ClipboardList, Inbox, ExternalLink } from "lucide-react";

// Loaded on demand — keeps the modal (and its image handling) out of the initial bundle
const ExperienceDetailModal = dynamic(() => import("./ExperienceDetailModal"), {
  ssr: false,
});

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

function ExpCard({ exp, color, index, onClick }: { exp: Experience; color: string; index: number; onClick: () => void }) {
  const isPresent = !exp.endDate || exp.endDate === "Sekarang" || exp.endDate.toLowerCase() === "present";
  const [imgIdx, setImgIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance through the card's photos every few seconds (pause while hovering)
  useEffect(() => {
    if (exp.images.length <= 1 || paused) return;
    const id = setInterval(() => {
      setImgIdx((p) => (p + 1) % exp.images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [exp.images.length, paused]);

  const image = exp.images[imgIdx % exp.images.length];
  const nextSrc =
    exp.images.length > 1
      ? exp.images[(imgIdx + 1) % exp.images.length].src
      : undefined;

  return (
    <article
      className="glass-card p-5 fade-in group flex flex-col"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image — a real button that opens the modal */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`View details: ${exp.title} at ${exp.organization}`}
        className="relative w-full h-44 rounded-xl overflow-hidden mb-4 block bg-stone-900 text-left"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {image ? (
          <CrossfadeImage
            src={image.src}
            nextSrc={nextSrc}
            alt={`${exp.organization} photo ${(imgIdx % exp.images.length) + 1}`}
            className="group-hover:scale-105"
            objectPosition={image.position || "center"}
            imageTransform={`scale(${image.zoom || 1})`}
            sizes="400px"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-stone-700">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        )}
        {/* Vignette overlay */}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        {exp.images.length > 1 && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white/80 px-2 py-0.5 rounded-full tabular-nums">
            {exp.images.length} photos
          </span>
        )}
      </button>

      <div className="flex items-start justify-between gap-2 mb-1">
        <button
          type="button"
          onClick={onClick}
          className={`text-left font-bold text-sm leading-tight ${color} group-hover:text-white transition-colors`}
        >
          {exp.title}
        </button>
        <span
          className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border tabular-nums ${
            isPresent
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-stone-800 border-stone-700 text-stone-300"
          }`}
        >
          {exp.startDate} – {isPresent ? "Now" : exp.endDate}
        </span>
      </div>
      <p className="text-sm text-stone-300 mb-2 font-medium">{exp.organization}</p>
      {exp.description && (
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mb-3">{exp.description}</p>
      )}
      <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-violet-400">
        View Details <ExternalLink size={12} aria-hidden="true" />
      </div>
    </article>
  );
}

export default function Experience({ experiences }: { experiences: Experience[] }) {
  const [tab, setTab] = useState<"organization" | "committee">("organization");
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  if (!experiences) return null;

  const orgs = experiences.filter((e) => e.type === "organization");
  const coms = experiences.filter((e) => e.type === "committee");
  const list = tab === "organization" ? orgs : coms;

  return (
    <section id="experience" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="section-head">
          <p className="section-eyebrow">Career</p>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">My organizational and committee experience</p>
          <p className="section-meta">
            {list.length} {tab} role{list.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-10">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 gap-1" role="group" aria-label="Filter experience by type">
            {([
              { key: "organization", label: <span className="flex items-center gap-1.5"><Briefcase size={14} aria-hidden="true" /> Organization</span>, count: orgs.length },
              { key: "committee",    label: <span className="flex items-center gap-1.5"><ClipboardList size={14} aria-hidden="true" /> Committee</span>, count: coms.length },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                aria-pressed={tab === key}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  tab === key
                    ? "bg-white text-stone-900"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {label} <span className="opacity-60 text-xs tabular-nums">({count})</span>
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
                onClick={() => setSelectedExp(exp)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-600 flex flex-col items-center">
            <Inbox size={48} className="mb-4 opacity-50" aria-hidden="true" />
            <p>No {tab} experience listed yet.</p>
          </div>
        )}
      </div>

      {selectedExp && (
        <ExperienceDetailModal
          exp={selectedExp}
          onClose={() => setSelectedExp(null)}
        />
      )}
    </section>
  );
}
