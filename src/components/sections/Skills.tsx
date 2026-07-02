import { skillIcons, categoryIcons } from "@/components/ui/SkillIcons";

type Skill = { name: string };
type SkillCategory = { id: string; title: string; skills: Skill[] };

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Frontend":         { bg: "rgba(99,102,241,0.06)",  border: "rgba(99,102,241,0.2)",  text: "#818cf8", glow: "rgba(99,102,241,0.3)" },
  "Backend & AI":     { bg: "rgba(139,92,246,0.06)",  border: "rgba(139,92,246,0.2)",  text: "#a78bfa", glow: "rgba(139,92,246,0.3)" },
  "Tools & Others":   { bg: "rgba(217,70,239,0.06)",  border: "rgba(217,70,239,0.2)",  text: "#e879f9", glow: "rgba(217,70,239,0.3)" },
};

const DEFAULT_COLOR = { bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.2)", text: "#a78bfa", glow: "rgba(139,92,246,0.3)" };

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(139,92,246,0.05),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">Skills</span>
        </h2>
        <p className="section-subtitle">Technologies and tools I work with</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category, ci) => {
            const colors = CATEGORY_COLORS[category.title] ?? DEFAULT_COLOR;
            return (
              <div
                key={category.id}
                className="glass-card p-6 fade-in group"
                style={{
                  animationDelay: `${ci * 0.12}s`,
                  borderColor: colors.border,
                }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: colors.bg, boxShadow: `0 0 16px ${colors.glow}` }}
                  >
                    {categoryIcons[category.title] || "⚡"}
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {category.title}
                    </h3>
                    <p className="text-zinc-600 text-xs">{category.skills.length} skills</p>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, si) => (
                    <div
                      key={skill.name}
                      className="skill-pill fade-in"
                      style={{ animationDelay: `${ci * 0.12 + si * 0.04}s` }}
                    >
                      <span className="text-base leading-none">
                        {skillIcons[skill.name] || "🔹"}
                      </span>
                      <span className="text-zinc-200 text-sm">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
