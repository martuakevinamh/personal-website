"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FolderGit2, Briefcase, Zap, Plus, User } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projRes, expRes, skillsRes] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("experiences").select("*", { count: "exact", head: true }),
          supabase.from("skills").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          projects: projRes.count ?? 0,
          experiences: expRes.count ?? 0,
          skills: skillsRes.count ?? 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease]">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-zinc-400">Welcome back! Here is a summary of your portfolio data.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        {[
          { label: "Total Projects", value: stats.projects, icon: <FolderGit2 size={24} />, color: "from-blue-500/20 to-cyan-500/20", text: "text-cyan-400" },
          { label: "Experiences", value: stats.experiences, icon: <Briefcase size={24} />, color: "from-violet-500/20 to-fuchsia-500/20", text: "text-fuchsia-400" },
          { label: "Skills Listed", value: stats.skills, icon: <Zap size={24} />, color: "from-amber-500/20 to-orange-500/20", text: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-white/5 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">{stat.label}</p>
                {loading ? (
                  <div className="h-10 w-16 bg-white/10 animate-pulse rounded-lg mt-1" />
                ) : (
                  <p className={`text-4xl font-black ${stat.text}`}>{stat.value}</p>
                )}
              </div>
              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 text-white/80">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 border border-white/5 mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/projects" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium">
            <span className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center"><Plus size={16} /></span>
            Add New Project
          </a>
          <a href="/admin/experiences" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium">
            <span className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center"><Briefcase size={16} /></span>
            Add Experience
          </a>
          <a href="/admin/skills" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center"><Zap size={16} /></span>
            Manage Skills
          </a>
          <a href="/admin/personal" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><User size={16} /></span>
            Update Profile
          </a>
        </div>
      </div>
    </div>
  );
}
