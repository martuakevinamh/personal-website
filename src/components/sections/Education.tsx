import { educationData } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="section-title">
          <span className="gradient-text">Education</span>
        </h2>
        <p className="section-subtitle">My academic journey and qualifications</p>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Timeline Line */}
          <div className="timeline-line" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {educationData.map((edu, index) => (
              <div
                key={edu.id}
                className="relative fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-1.65rem] md:left-[-2.15rem] top-0">
                  <div className="timeline-dot" />
                </div>

                {/* Content Card */}
                <div className="glass-card p-6">
                  {/* Year Badge */}
                  <div className="inline-flex items-center gap-2 tag mb-4">
                    <span>🎓</span>
                    <span>
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>

                  {/* Institution */}
                  <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>

                  {/* Degree & Field */}
                  <p className="text-violet-500 font-medium mb-2">
                    {edu.degree} - {edu.field}
                  </p>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-zinc-400 text-sm">
                      {edu.description}
                    </p>
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
