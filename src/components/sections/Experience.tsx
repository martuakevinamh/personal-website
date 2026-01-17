"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import { experienceData, type Experience } from "@/data/experience";

type ExperienceImage = {
  src: string;
  position?: string;
  zoom?: number;
};

type Experience = {
  id: number;
  title: string;
  organization: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  images: ExperienceImage[];
};

// Image Slideshow Component
function ImageSlideshow({ images, alt }: { images: ExperienceImage[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-48 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
        No Image
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 group">
      {images.map((img, index) => (
        <Image
          key={img.src}
          src={img.src}
          alt={`${alt} - ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ 
            objectPosition: img.position || "center center",
            transform: `scale(${img.zoom || 1})`,
            transformOrigin: img.position || "center center"
          }}
        />
      ))}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 text-xs bg-black/60 px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Experience Card Component
function ExperienceCard({ exp, index, color }: { exp: Experience; index: number; color: string }) {
  return (
    <div
      className="glass-card p-5 fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Slideshow */}
      <ImageSlideshow images={exp.images} alt={exp.organization} />

      {/* Content */}
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-bold ${color}`}>{exp.title}</h4>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded whitespace-nowrap ml-2">
          {exp.startDate} - {exp.endDate}
        </span>
      </div>
      <p className="text-sm text-zinc-300 mb-2">{exp.organization}</p>
      <p className="text-sm text-zinc-400">{exp.description}</p>
    </div>
  );
}

export default function Experience({ experiences }: { experiences: Experience[] }) {
  // Guard clause for missing data
  if (!experiences) return null;

  const organizations = experiences.filter((exp) => exp.type === "organization");
  const committees = experiences.filter((exp) => exp.type === "committee");

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="section-title">
          <span className="gradient-text">Experience</span>
        </h2>
        <p className="section-subtitle">
          My organizational and committee experience
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Organisasi */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              Organisasi
            </h3>
            <div className="space-y-6">
              {organizations.length > 0 ? (
                organizations.map((exp, index) => (
                  <ExperienceCard
                    key={exp.id}
                    exp={exp}
                    index={index}
                    color="text-violet-400"
                  />
                ))
              ) : (
                <p className="text-zinc-500 italic">No organization experience listed.</p>
              )}
            </div>
          </div>

          {/* Kepanitiaan */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Kepanitiaan
            </h3>
            <div className="space-y-6">
              {committees.length > 0 ? (
                committees.map((exp, index) => (
                  <ExperienceCard
                    key={exp.id}
                    exp={exp}
                    index={index}
                    color="text-fuchsia-400"
                  />
                ))
              ) : (
                 <p className="text-zinc-500 italic">No committee experience listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
