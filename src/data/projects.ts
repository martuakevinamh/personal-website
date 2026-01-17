// Projects Data

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string; // Path to project screenshot
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: "ongoing" | "completed"; // Status project
}

export const projectsData: Project[] = [
  // Ongoing Projects
  {
    id: 1,
    title: "Website GKPI Bandar Lampung",
    description:
    "Website resmi GKPI Bandar Lampung yang berfungsi sebagai platform informasi GKPI.",
    image: "/images/projects/project-1.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
    demoUrl: "https://website-gkpibdl.vercel.app/",
    githubUrl: "https://github.com/kevinlubis2909/website-gkpibdl",
    featured: true,
    status: "ongoing",
  },
  
  // Completed Projects
  {
    id: 3,
    title: "Personal Website",
    description:
      "Website portfolio personal dengan desain modern dan animasi yang smooth.",
    image: "/images/projects/project-3.jpg",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
    demoUrl: "https://personal-website.vercel.app/",
    githubUrl: "https://github.com/martuakevinamh/personal-website.git",
    featured: true,
    status: "completed",
  },
  {
    id: 4,
    title: "Game Pustaka Swardwipa",
    description:
      "Game Pustaka Swardwipa yang berfungsi sebagai platform informasi Pustaka Swardwipa.",
    image: "/images/projects/project-4.jpg",
    tags: ["Godot Engine", "GDScript"],
    githubUrl: "https://github.com/FadilRifqi/pustaka-swarnadwipa.git",
    featured: false,
    status: "completed",
  },
];
