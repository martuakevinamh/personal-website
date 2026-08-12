import { GraduationCap } from "lucide-react";
import { Education as EducationType } from "@/lib/types";

export default function Education({ educationData }: { educationData: EducationType[] }) {
  if (!educationData || educationData.length === 0) return null;

  const first = educationData[0];
  const meta =
    educationData.length > 1
      ? `${educationData.length} programs`
      : `${first.field} · ${first.start_year} – ${first.end_year}`;

  return (
    <section id="education" className="py-28 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="section-head">
          <p className="section-eyebrow">Academic</p>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic journey and qualifications</p>
          <p className="section-meta">{meta}</p>
        </div>

        <div className="space-y-6">
          {educationData.map((edu, i) => (
            <article
              key={edu.id}
              className="glass-card p-6 sm:p-8 fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0"
                    aria-hidden="true"
                  >
                    <GraduationCap size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold">{edu.institution}</h3>
                    <p className="text-violet-400 font-medium text-sm mt-0.5">
                      {edu.degree}
                    </p>
                  </div>
                </div>
                <span className="tag tabular-nums shrink-0">
                  {edu.start_year} – {edu.end_year}
                </span>
              </div>

              {edu.field && (
                <p className="text-stone-400 text-sm mt-3">{edu.field}</p>
              )}

              {edu.description && (
                <p className="text-stone-500 text-sm leading-relaxed mt-4 whitespace-pre-line">
                  {edu.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
