"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Skill = {
  id: number;
  name: string;
  category: string;
  sort_order: number;
};

const CATEGORIES = ["Frontend", "Backend & AI", "Tools & Others"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkillName, setNewSkillName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
       toast.error("Error fetching skills: " + error.message);
    } else {
       setSkills(data || []);
    }
    setLoading(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const loadingToast = toast.loading("Adding skill...");

    try {
      const { error } = await supabase.from("skills").insert({
        name: newSkillName,
        category: selectedCategory,
        sort_order: skills.length, 
      });

      if (error) throw error;
      
      setNewSkillName("");
      setShowForm(false);
      toast.dismiss(loadingToast);
      toast.success("Skill added successfully");
      fetchSkills();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error adding: " + (error as Error).message);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deletingId) return;

    const loadingToast = toast.loading("Deleting...");
    try {
      const { error } = await supabase.from("skills").delete().eq("id", deletingId);
      if (error) throw error;
      
      toast.dismiss(loadingToast);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting: " + (error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Manage Skills</h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
             <span>+</span> Add New Skill
          </button>
        )}
      </div>

       <ConfirmModal 
        isOpen={!!deletingId}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        onConfirm={handleDeleteSkill}
        onClose={() => setDeletingId(null)}
      />

      {/* Add New Skill Form */}
      {showForm && (
        <div className="glass-card p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Skill</h3>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleAddSkill} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Skill Name</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
                placeholder="e.g. Next.js"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary py-2 px-6">
              Add
            </button>
          </form>
        </div>
      )}

      {/* Skills List by Category */}
      <div className="grid md:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <div key={category} className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 text-violet-400 border-b border-zinc-800 pb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg group"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => setDeletingId(skill.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              {skills.filter((s) => s.category === category).length === 0 && (
                <div className="text-sm text-zinc-600 italic">No skills yet</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
