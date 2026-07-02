"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

type Skill = {
  id: number;
  name: string;
  category: string;
  sort_order: number;
};

const CATEGORIES = ["Frontend", "Backend & AI", "Tools & Others"];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: CATEGORIES[0] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("sort_order", { ascending: true });
      
    if (error) toast.error("Failed to fetch skills");
    else setSkills(data || []);
    
    setLoading(false);
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    
    setSaving(true);
    // get max sort_order for category
    const categorySkills = skills.filter((s) => s.category === newSkill.category);
    const maxSort = categorySkills.length > 0 ? Math.max(...categorySkills.map((s) => s.sort_order)) : 0;

    const payload = {
      name: newSkill.name.trim(),
      category: newSkill.category,
      sort_order: maxSort + 1,
    };

    const { error } = await supabase.from("skills").insert([payload]);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Skill added!");
      setNewSkill({ name: "", category: newSkill.category }); // Keep same category selected
      setIsAdding(false);
      fetchSkills();
    }
    setSaving(false);
  }

  async function handleDeleteSkill(id: number) {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Skill deleted");
      setSkills(skills.filter((s) => s.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl animate-[fadeIn_0.5s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills Management</h1>
          <p className="text-zinc-400">Add, categorize, and organize your technical skills.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition-colors border border-white/10 flex items-center gap-2"
        >
          {isAdding ? "Cancel" : <><Plus size={18} /> Add New Skill</>}
        </button>
      </div>

      {/* Add New Skill Form */}
      {isAdding && (
        <form onSubmit={handleAddSkill} className="glass-card p-6 mb-8 border border-violet-500/30 animate-[fadeIn_0.2s_ease]">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Skill</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/2 space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Skill Name</label>
              <input
                type="text"
                required
                autoFocus
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                placeholder="e.g. React, Python, Figma"
              />
            </div>
            <div className="w-full sm:w-1/3 space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Skills Grouped by Category */}
      <div className="grid lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const catSkills = skills.filter((s) => s.category === category);
          
          return (
            <div key={category} className="glass-card p-5 border border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="font-bold text-white">{category}</h3>
                <span className="text-xs font-medium text-zinc-500 bg-black/50 px-2.5 py-1 rounded-full border border-white/5">
                  {catSkills.length} items
                </span>
              </div>

              {catSkills.length === 0 ? (
                <div className="text-zinc-600 text-sm italic text-center py-6 flex-1 flex items-center justify-center">
                  No skills added yet
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group relative bg-black/40 border border-white/10 hover:border-violet-500/40 text-sm text-zinc-300 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-default"
                    >
                      <span>{skill.name}</span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                        title="Delete skill"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
