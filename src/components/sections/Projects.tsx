"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ProjectImage = {
  src: string;
  position: string;
};

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

// Individual project card with auto-rotating images
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="glass-card overflow-hidden group fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-800">
        {images.length > 0 ? (
          images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={`${project.title} - ${i + 1}`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                i === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition: img.position }}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-4xl">
            📁
          </div>
        )}
        {/* Top gradient overlay for badge visibility */}
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/60 to-transparent" />
        {/* Bottom overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent opacity-60" />

        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImageIndex ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Status Badge */}
        {project.status === "ongoing" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            In Progress
          </div>
        )}

        {project.status === "completed" && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-violet-500/50 text-violet-400 px-3 py-1 rounded-full text-xs font-medium">
            ✅ Completed
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-amber-500/50 text-amber-400 px-3 py-1 rounded-full text-xs font-medium">⭐ Featured</div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag, i) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-4 border-t border-zinc-800">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");

  if (!projects) return null;

  const ongoingProjects = projects.filter((p) => p.status === "ongoing");
  const completedProjects = projects.filter((p) => p.status === "completed");

  const displayedProjects = activeTab === "ongoing" ? ongoingProjects : completedProjects;

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="section-title">
          <span className="gradient-text">Projects</span>
        </h2>
        <p className="section-subtitle">
          Some of my recent work and personal projects
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "ongoing"
                ? "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white"
                : "glass text-zinc-400 hover:text-white"
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Ongoing ({ongoingProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "completed"
                ? "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white"
                : "glass text-zinc-400 hover:text-white"
            }`}
          >
            <span className="text-lg text-green-400">✓</span>
            Completed ({completedProjects.length})
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {displayedProjects.length === 0 && (
          <div className="text-center text-zinc-500 py-12">
            No {activeTab} projects yet
          </div>
        )}
      </div>
    </section>
  );
}
