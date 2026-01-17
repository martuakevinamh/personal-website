import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import { supabase } from "@/lib/supabase";

type ExperienceImageRaw = {
  src: string;
  position: string | null;
  zoom: number | null;
};

export const revalidate = 10; // Revalidate every 10s

type SkillCategory = {
  id: string;
  title: string;
  skills: { name: string; icon?: string }[];
};

export default async function Home() {
  // 1. Fetch Personal Info
  const { data: personal } = await supabase.from("personal").select("*").single();

  // 2. Fetch Skills (Group by category)
  const { data: skillsRaw } = await supabase.from("skills").select("*").order("sort_order");
  
  // Group logic
  const skillsGrouped: SkillCategory[] = skillsRaw 
    ? Object.values(skillsRaw.reduce((acc: Record<string, SkillCategory>, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = {
            id: skill.category, // Use category name as ID 
            title: skill.category,
            skills: []
          };
        }
        acc[skill.category].skills.push({ name: skill.name });
        return acc;
      }, {} as Record<string, SkillCategory>)) 
    : [];
  // Sort categories if needed, or rely on manual order in code if we want specific order. 
  // For now let's assume they come out okay or we fix sort later.

  // 3. Fetch Experiences with Images
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*, images:experience_images(src, position, zoom)")
    .order("start_date", { ascending: false });

  // Transform experiences
  const experiencesTransformed = experiences?.map(exp => ({
    ...exp,
    startDate: exp.start_date ? exp.start_date.split("-")[0] : "", // '2025-01-01' -> '2025'
    endDate: exp.end_date ? exp.end_date.split("-")[0] : "Sekarang",
    // Pass full object now, defaulting zoom to 1 if missing
    images: Array.isArray(exp.images) 
      ? (exp.images as ExperienceImageRaw[]).map((img) => ({
          src: img.src,
          position: img.position || "center center",
          zoom: img.zoom || 1
        })) 
      : []
  })) || [];

  // 4. Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  const projectsTransformed = projects?.map(p => ({
    ...p,
    image: p.image_src, // map db column to prop
    demoUrl: p.demo_url,
    githubUrl: p.github_url
  })) || [];

  return (
    <>
      <Navbar />
      <main>
        <Hero personalInfo={personal} />
        <About personalInfo={personal} />
        {/* Education is static for now or can be added later */}
        <Education />
        <Experience experiences={experiencesTransformed} />
        <Skills skills={skillsGrouped} />
        <Projects projects={projectsTransformed} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
