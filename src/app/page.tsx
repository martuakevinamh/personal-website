import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

import { getPersonal } from "@/lib/queries/personal";
import { getSkillsByCategory } from "@/lib/queries/skills";
import { getExperiences } from "@/lib/queries/experiences";
import { getProjects } from "@/lib/queries/projects";
import { getEducation } from "@/lib/queries/education";

// Removed static fallbacks, strictly using DB data

export const dynamic = "force-dynamic";

export default async function Home() {

  // ── Fetch all data in parallel ──────────────────────────────
  const [personal, skillsGroupedDB, experiencesDB, projectsDB, educationDB] = await Promise.all([
    getPersonal(),
    getSkillsByCategory(),
    getExperiences(),
    getProjects(),
    getEducation(),
  ]);

  // ── Personal ─────────────────────────────────────────────────
  const personalTransformed = personal ?? {
    id: 0,
    name: "",
    role: "",
    bio: "",
    location: "",
    email: "",
    github_url: null,
    linkedin_url: null,
    instagram_url: null,
    resume_url: null,
    profile_images: [],
    stats: [],
    created_at: "",
  };

  // ── Skills ───────────────────────────────────────────────────
  const skillsForUI = Object.entries(skillsGroupedDB).map(([cat, skills]) => ({
    id: cat,
    title: cat,
    skills,
  }));

  // ── Experiences ──────────────────────────────────────────────
  const experiencesForUI = experiencesDB.map((e) => ({
    id: e.id,
    title: e.title,
    organization: e.organization,
    type: e.type,
    startDate: e.start_date ? e.start_date.slice(0, 4) : "",
    endDate: e.end_date ? e.end_date.slice(0, 4) : "Sekarang",
    description: e.description,
    images: e.experience_images.map((img) => ({
      src: img.src,
      position: img.position,
      zoom: 1,
    })),
  }));

  type ProjectForUI = {
    id: number;
    title: string;
    description: string;
    images: { src: string; position: string }[];
    tags: string[];
    demoUrl?: string;
    githubUrl?: string;
    featured: boolean;
    status: "ongoing" | "completed";
  };

  const projectsForUI: ProjectForUI[] = projectsDB.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    images: p.project_images.map((img) => ({ src: img.src, position: img.position })),
    tags: p.tags ?? [],
    demoUrl: p.demo_url ?? undefined,
    githubUrl: p.github_url ?? undefined,
    featured: p.featured,
    status: (p.status === "ongoing" ? "ongoing" : "completed") as "ongoing" | "completed",
  }));

  // ────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main>
        <Hero personalInfo={personalTransformed} />
        <About personalInfo={personalTransformed} />
        <Education educationData={educationDB} />
        <Experience experiences={experiencesForUI} />
        <Skills skills={skillsForUI} />
        <Projects projects={projectsForUI} />
        <Contact personalInfo={personalTransformed} />
      </main>
      <Footer personalInfo={personalTransformed} />
    </>
  );
}
