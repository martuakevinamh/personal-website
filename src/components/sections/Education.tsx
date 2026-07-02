import { GraduationCap } from "lucide-react";
import { Education as EducationType } from "@/lib/types";

export default function Education({ educationData }: { educationData: EducationType[] }) {
  if (!educationData || educationData.length === 0) return null;

  return (
    <section id="education" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(34,211,238,0.03),transparent)]" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">Education</span>
        </h2>
        <p className="section-subtitle">My academic journey and qualifications</p>

        {/* Timeline */}
        <div className="relative pl-10">
          {/* Vertical line */}
          <div
            className="absolute left-3 top-2 bottom-2 w-px"
            style={{
              background: "linear-gradient(to bottom, rgba(139,92,246,0.8), rgba(139,92,246,0.1))",
            }}
          />

          <div className="space-y-8">
            {educationData.map((edu, i) => (
              <div
                key={edu.id}
                className="relative fade-in group"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Dot */}
                <div className="absolute left-[-2.05rem] top-5 z-10">
                  <div className="timeline-dot group-hover:scale-110 transition-transform" />
                </div>

                {/* Card */}
                <div className="glass-card p-6 group-hover:border-violet-500/20 transition-all">
                  {/* Year badge */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="tag flex items-center gap-1.5">
                      <GraduationCap size={16} /> {edu.start_year} – {edu.end_year}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1">{edu.institution}</h3>
                  <p className="text-violet-400 font-medium text-sm mb-3">
                    {edu.degree} · {edu.field}
                  </p>
                  {edu.description && (
                    <p className="text-zinc-500 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
