"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, experiences: 0, skills: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsRes, experiencesRes, skillsRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        projects: projectsRes.count || 0,
        experiences: experiencesRes.count || 0,
        skills: skillsRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: "Add New Experience", href: "/admin/experience" },
    { label: "Add New Skill", href: "/admin/skills" },
    { label: "Add New Project", href: "/admin/projects" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-zinc-400">Welcome to your portfolio admin panel.</p>
      </div>

      {/* Overview Stats */}
      <h2 className="text-lg font-semibold text-zinc-300 mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">{stats.projects}</div>
          <div className="text-zinc-400 text-sm">Active Projects</div>
        </div>

        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">{stats.experiences}</div>
          <div className="text-zinc-400 text-sm">Experiences</div>
        </div>

        <div className="glass-card p-6">
          <div className="text-3xl font-bold mb-1">{stats.skills}</div>
          <div className="text-zinc-400 text-sm">Skills Listed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-zinc-300 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card p-4 text-center hover:border-violet-500/50 transition-all"
          >
            <span className="font-medium text-white">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
