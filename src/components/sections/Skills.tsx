// import { skillsData } from "@/data/skills"; // Removed static import
import { skillIcons, categoryIcons } from "@/components/ui/SkillIcons";

// Define prop type
type Skill = { name: string };
type SkillCategory = { id: string; title: string; skills: Skill[] };

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 relative bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="section-title">
          <span className="gradient-text">Skills</span>
        </h2>
        <p className="section-subtitle">
          Technologies and tools I work with
        </p>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="glass-card p-6 fade-in"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-violet-400">
                  {/* Fallback to generic icon if category name mismatch */}
                  {categoryIcons[category.title] || categoryIcons["Tools & Others"]} 
                </span>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 fade-in"
                    style={{
                      animationDelay: `${categoryIndex * 0.1 + skillIndex * 0.05}s`,
                    }}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      {skillIcons[skill.name] || "🔹"}
                    </span>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
