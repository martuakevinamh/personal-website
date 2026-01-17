"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { personalInfo } from "@/data/personal";
import { skillsData } from "@/data/skills";
import { experienceData } from "@/data/experience";
import { projectsData } from "@/data/projects";

export default function DashboardPage() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("This will overwrite/duplicate data in database with static files. Continue?")) return;
    setSeeding(true);

    try {
      // 1. Personal
      await supabase.from("personal").delete().neq("id", 0); // Clear
      
      await supabase.from("personal").insert({
        name: personalInfo.name,
        role: personalInfo.title,
        bio: personalInfo.bio,
        location: personalInfo.location,
        email: personalInfo.email,
        resume_url: personalInfo.resumeUrl,
        // Add others if they exist in static file, else empty
      });

      // 2. Skills
      await supabase.from("skills").delete().neq("id", 0);
      const skillRows = skillsData.flatMap(cat => 
        cat.skills.map((s, idx) => ({
          name: s.name,
          category: cat.title,
          sort_order: idx
        }))
      );
      await supabase.from("skills").insert(skillRows);

      // Helper for date parsing
      const parseDate = (d: string) => {
        if (!d || d === "Sekarang") return null;
        if (/^\d{4}$/.test(d)) return `${d}-01-01`; // "2024" -> "2024-01-01"
        return d; // Assume valid date string otherwise
      };

      // 3. Experiences
      await supabase.from("experience_images").delete().neq("id", 0);
      await supabase.from("experiences").delete().neq("id", 0);
      
      for (const exp of experienceData) {
        const { data: newExp, error } = await supabase.from("experiences").insert({
          title: exp.title,
          organization: exp.organization,
          type: exp.type,
          start_date: parseDate(exp.startDate),
          end_date: parseDate(exp.endDate),
          description: exp.description,
        }).select().single();

        if (error) throw error;
        
        if (newExp && exp.images?.length > 0) {
           await supabase.from("experience_images").insert(
             exp.images.map((img, idx) => ({
               experience_id: newExp.id,
               src: img,
               position: "center center",
               sort_order: idx
             }))
           );
        }
      }

      // 4. Projects
      await supabase.from("projects").delete().neq("id", 0);
      for (const proj of projectsData) {
        await supabase.from("projects").insert({
          title: proj.title,
          description: proj.description,
          image_src: proj.image,
          tags: proj.tags,
          demo_url: proj.demoUrl,
          github_url: proj.githubUrl,
          featured: proj.featured,
          status: proj.status,
        });
      }

      alert("Data seeded successfully!");
    } catch (e: unknown) {
      console.error("Seeding Error Details:", e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any; 
      alert("Error seeding: " + (err?.message || err?.error_description || JSON.stringify(e)));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
           <p className="text-zinc-400">Welcome to your portfolio admin panel.</p>
        </div>
        <button 
          onClick={handleSeed} 
          disabled={seeding}
          className="bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 px-4 py-2 rounded-lg hover:bg-yellow-600/30 transition-colors"
        >
          {seeding ? "Seeding..." : "⚠️ Seed Static Data to DB"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Placeholder Stats */}
        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">3</div>
          <div className="text-zinc-400 text-sm">Active Projects</div>
        </div>
        
        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">5</div>
          <div className="text-zinc-400 text-sm">Experiences</div>
        </div>

        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">15</div>
          <div className="text-zinc-400 text-sm">Skills Listed</div>
        </div>
      </div>
    </div>
  );
}
