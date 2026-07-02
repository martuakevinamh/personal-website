"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProjectDetailModal from "./ProjectDetailModal";
import { Star, Inbox } from "lucide-react";

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

function ProjectCard({ project, index, onSelect }: { project: Project; index: number; onSelect: (p: Project) => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = project.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setImgIdx((p) => (p + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div
      className="glass-card overflow-hidden group fade-in cursor-pointer flex flex-col hover:border-violet-500/30"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onSelect(project)}
    >
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        {images.length > 0 ? (
          images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={`${project.title} - ${i + 1}`}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                i === imgIdx ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition: img.position }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-4xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#12121a] via-transparent to-black/40 opacity-90 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.status === "ongoing" && (
            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-green-500/30 text-green-400 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              In Progress
            </span>
          )}
          {project.status === "completed" && (
            <span className="bg-black/60 backdrop-blur-md border border-violet-500/30 text-violet-400 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              Completed
            </span>
          )}
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Star size={12} className="fill-amber-400" /> Featured
          </div>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={`transition-all duration-300 rounded-full ${
                  i === imgIdx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors line-clamp-1">{project.title}</h3>
        <p className="text-zinc-400 text-sm mb-5 line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-300">
              {tag}
            </span>
          ))}
          {project.tags?.length > 3 && (
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-400">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-5 border-t border-white/6 mt-auto">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-white/5 text-zinc-300 hover:bg-white/10 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<"ongoing" | "completed">("ongoing");
  const [selected, setSelected] = useState<Project | null>(null);

  if (!projects) return null;

  const ongoing = projects.filter((p) => p.status === "ongoing");
  const completed = projects.filter((p) => p.status === "completed");
  const list = tab === "ongoing" ? ongoing : completed;

  return (
    <section id="projects" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(99,102,241,0.04),transparent)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">Projects</span>
        </h2>
        <p className="section-subtitle">Some of my recent work and personal projects</p>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass rounded-full p-1 flex gap-1">
            {([
              { key: "ongoing", label: "In Progress", count: ongoing.length },
              { key: "completed", label: "Completed", count: completed.length },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onSelect={setSelected} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600 flex flex-col items-center">
            <Inbox size={48} className="mb-4 opacity-50" />
            <p>No {tab} projects yet.</p>
          </div>
        )}
      </div>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
