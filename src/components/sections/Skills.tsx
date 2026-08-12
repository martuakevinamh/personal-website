import { Boxes } from "lucide-react";
import { categoryIcons } from "@/components/ui/SkillIcons";

type Skill = { name: string };
type SkillCategory = { id: string; title: string; skills: Skill[] };

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Frontend":         { bg: "rgba(201,162,39,0.05)",  border: "rgba(201,162,39,0.22)", text: "#d4a93a", glow: "rgba(201,162,39,0.25)" },
  "Backend & AI":     { bg: "rgba(217,180,92,0.05)",  border: "rgba(217,180,92,0.2)",  text: "#d9b45c", glow: "rgba(217,180,92,0.25)" },
  "Tools & Others":   { bg: "rgba(176,138,30,0.06)",  border: "rgba(176,138,30,0.22)", text: "#c9a227", glow: "rgba(176,138,30,0.25)" },
};

const DEFAULT_COLOR = { bg: "rgba(201,162,39,0.05)", border: "rgba(201,162,39,0.22)", text: "#d4a93a", glow: "rgba(201,162,39,0.25)" };

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  if (!skills || skills.length === 0) return null;

  const totalSkills = skills.reduce((n, cat) => n + cat.skills.length, 0);

  return (
    <section id="skills" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="section-head">
          <p className="section-eyebrow">Toolkit</p>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">Technologies and tools I work with</p>
          <p className="section-meta">
            {totalSkills} tools · {skills.length} categories
          </p>
        </div>

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
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    aria-hidden="true"
                  >
                    {categoryIcons[category.title] || <Boxes size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {category.title}
                    </h3>
                    <p className="text-stone-500 text-xs tabular-nums">
                      {category.skills.length} skill{category.skills.length === 1 ? "" : "s"}
                    </p>
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
                      <span className="text-stone-200 text-sm font-medium">{skill.name}</span>
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
