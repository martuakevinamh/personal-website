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
import { experienceData } from "@/data/experience";
import { projectsData } from "@/data/projects";
import { personalInfo as staticPersonalInfo } from "@/data/personal";
import { skillsData } from "@/data/skills";


type ExperienceImageRaw = {
  src: string;
  position: string | null;
  zoom: number | null;
};

export const dynamic = 'force-dynamic'; // Always fetch fresh data

type SkillCategory = {
  id: string;
  title: string;
  skills: { name: string; icon?: string }[];
};

export default async function Home() {
  // 1. Fetch Personal Info
  const { data: personal } = await supabase.from("personal").select("*").single();

  // Keep local static personal info as fallback so Hero/About never disappear
  const personalTransformed = personal
    ? personal
    : {
        name: staticPersonalInfo.name,
        role: staticPersonalInfo.title,
        bio: staticPersonalInfo.bio,
        location: staticPersonalInfo.location,
        email: staticPersonalInfo.email,
        github_url: "",
        linkedin_url: "",
        instagram_url: "",
        resume_url: staticPersonalInfo.resumeUrl,
      };

  // 2. Fetch Skills (Group by category)
  const { data: skillsRaw } = await supabase.from("skills").select("*").order("sort_order");
  
  // Group DB skills by category
  const dbSkillsGrouped: SkillCategory[] = skillsRaw
    ? Object.values(skillsRaw.reduce((acc: Record<string, SkillCategory>, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = {
            id: skill.category,
            title: skill.category,
            skills: [],
          };
        }
        acc[skill.category].skills.push({ name: skill.name });
        return acc;
      }, {} as Record<string, SkillCategory>))
    : [];

  // Keep local static skills as fallback so Skills section never disappears
  const staticSkillsGrouped: SkillCategory[] = skillsData.map((category) => ({
    id: String(category.id),
    title: category.title,
    skills: category.skills.map((skill) => ({ name: skill.name })),
  }));

  // Merge by category title: DB takes precedence, static fills missing categories
  const skillsMap = new Map<string, SkillCategory>();
  dbSkillsGrouped.forEach((category) => {
    skillsMap.set(category.title, category);
  });
  staticSkillsGrouped.forEach((category) => {
    if (!skillsMap.has(category.title)) {
      skillsMap.set(category.title, category);
    }
  });
  const skillsGrouped = Array.from(skillsMap.values());

  // 3. Fetch Experiences with Images
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*, images:experience_images(src, position, zoom)")
    .order("start_date", { ascending: false });

  // Transform experiences from database
  const dbExperiences = experiences?.map(exp => ({
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

  // Keep local static entries as fallback so older data is never hidden
  const staticExperiences = experienceData.map((exp) => ({
    id: exp.id,
    title: exp.title,
    organization: exp.organization,
    type: exp.type,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    images: (exp.images || []).map((src) => ({
      src,
      position: "center center",
      zoom: 1,
    })),
  }));

  const experienceMap = new Map<string, (typeof dbExperiences)[number]>();
  dbExperiences.forEach((exp) => {
    experienceMap.set(`${exp.title}-${exp.organization}`, exp);
  });
  staticExperiences.forEach((exp) => {
    const key = `${exp.title}-${exp.organization}`;
    if (!experienceMap.has(key)) {
      experienceMap.set(key, exp);
    }
  });
  const experiencesTransformed = Array.from(experienceMap.values());

  // 4. Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch project images
  const { data: projectImages } = await supabase
    .from("project_images")
    .select("*")
    .order("sort_order");

  const dbProjects = projects?.map(p => {
    // Find images for this project
    const images = projectImages?.filter(img => img.project_id === p.id)
      .map(img => ({
        src: img.src,
        position: img.position || "center center"
      })) || [];
    return {
      ...p,
      images, // Pass all images for slideshow
      demoUrl: p.demo_url,
      githubUrl: p.github_url
    };
  }) || [];

  // Keep local static entries as fallback so older data is never hidden
  const staticProjects = projectsData.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    images: project.images || [],
    tags: project.tags,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    featured: project.featured,
    status: project.status,
  }));

  const projectMap = new Map<string, (typeof dbProjects)[number]>();
  dbProjects.forEach((project) => {
    projectMap.set(project.title, project);
  });
  staticProjects.forEach((project) => {
    if (!projectMap.has(project.title)) {
      projectMap.set(project.title, project);
    }
  });
  const projectsTransformed = Array.from(projectMap.values());

  return (
    <>
      <Navbar />
      <main>
        <Hero personalInfo={personalTransformed} />
        <About personalInfo={personalTransformed} />
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
