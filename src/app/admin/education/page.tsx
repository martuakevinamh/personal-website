"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, GraduationCap } from "lucide-react";

type Education = {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  description: string;
  sort_order: number;
};

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    start_year: "",
    end_year: "",
    description: "",
    sort_order: 0,
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
    if (error) toast.error("Failed to fetch education data");
    else setItems(data || []);
    setLoading(false);
  }

  const handleNew = () => {
    setEditingId(null);
    setFormData({ institution: "", degree: "", field: "", start_year: "", end_year: "", description: "", sort_order: items.length });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Education) => {
    setEditingId(item.id);
    setFormData({
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      start_year: item.start_year,
      end_year: item.end_year,
      description: item.description || "",
      sort_order: item.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) toast.error("Failed to delete entry");
    else {
      toast.success("Entry deleted");
      fetchEducation();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from("education").update(formData).eq("id", editingId);
        if (error) throw error;
        toast.success("Entry updated");
      } else {
        const { error } = await supabase.from("education").insert(formData);
        if (error) throw error;
        toast.success("Entry added");
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      toast.error(err.message || "Failed to save entry");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl animate-[fadeIn_0.5s_ease] pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Education</h1>
          <p className="text-zinc-400">Manage your academic background and degrees.</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> Add Education
        </button>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center text-zinc-500 flex flex-col items-center">
          <GraduationCap size={48} className="mb-4 text-zinc-600" />
          <p>No education entries added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-violet-500/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="font-bold text-white text-lg truncate">{item.institution}</h3>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {item.start_year} - {item.end_year}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-300 mb-2">{item.degree} • {item.field}</p>
                {item.description && (
                  <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{item.description}</p>
                )}
              </div>

              <div className="flex md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit entry"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-lg relative z-10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Education" : "Add Education"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Institution</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                  placeholder="e.g. Institut Teknologi Sumatera"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Degree</label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                    placeholder="e.g. Bachelor"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Field of Study</label>
                  <input
                    type="text"
                    required
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                    placeholder="e.g. Informatics Engineering"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Start Year</label>
                  <input
                    type="text"
                    required
                    value={formData.start_year}
                    onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                    placeholder="e.g. 2022"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">End Year</label>
                  <input
                    type="text"
                    required
                    value={formData.end_year}
                    onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                    placeholder="e.g. 2026 or Present"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 resize-y"
                  placeholder="Optional details..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sort Order</label>
                <input
                  type="number"
                  required
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-zinc-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
