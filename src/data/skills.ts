// Skills Data

export interface Skill {
  name: string;
}

export interface SkillCategory {
  id: number;
  title: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    id: 1,
    title: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "HTML/CSS" },
    ],
  },
  {
    id: 2,
    title: "Backend & AI",
    skills: [
      { name: "Node.js" },
      { name: "REST API" },
      { name: "Firebase" },
      { name: "Supabase" },
      { name: "YOLO" },
    ],
  },
  {
    id: 3,
    title: "Tools & Others",
    skills: [
      { name: "Git" },
      { name: "VS Code" },
      { name: "Figma" },
      { name: "Godot Engine" },
      { name: "Antigravity" },
    ],
  },
];

