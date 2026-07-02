"use client";

import { useState, useEffect } from "react";
import { getExperiences, createExperience, updateExperience, deleteExperience, addExperienceImage, deleteExperienceImage } from "@/lib/queries/experiences";
import { uploadImage, deleteImage } from "@/lib/storage";
import { ExperienceWithImages, ExperiencePayload } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Briefcase, Edit2, Trash2 } from "lucide-react";

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<ExperienceWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ExperiencePayload> & { id?: number }>({
    title: "",
    organization: "",
    type: "organization",
    start_date: "",
    end_date: "",
    description: "",
  });
  
  const [isCurrent, setIsCurrent] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function loadData() {
    setLoading(true);
    const data = await getExperiences();
    setExperiences(data);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  function handleEdit(exp: ExperienceWithImages) {
    setFormData({
      id: exp.id,
      title: exp.title,
      organization: exp.organization,
      type: exp.type as "organization" | "committee",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
    });
    setIsCurrent(!exp.end_date);
    setIsModalOpen(true);
  }

  function handleNew() {
    setFormData({
      title: "",
      organization: "",
      type: "organization",
      start_date: "",
      end_date: "",
      description: "",
    });
    setIsCurrent(false);
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const payload: ExperiencePayload = {
      title: formData.title!,
      organization: formData.organization!,
      type: formData.type as "organization" | "committee",
      start_date: formData.start_date || null,
      end_date: isCurrent ? null : (formData.end_date || null),
      description: formData.description || "",
    };

    try {
      if (formData.id) {
        await updateExperience(formData.id, payload);
        toast.success("Experience updated!");
      } else {
        await createExperience(payload);
        toast.success("Experience added!");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: number) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-white">Delete this experience and all its images?</p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-4 py-1.5 text-xs bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const ok = await deleteExperience(id);
              if (ok) {
                toast.success("Experience deleted");
                loadData();
              } else {
                toast.error("Failed to delete experience");
              }
            }} 
            className="px-4 py-1.5 text-xs bg-red-500 rounded-lg hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' } });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, expId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    toast.loading("Uploading image...", { id: "upload" });
    
    const url = await uploadImage(file, `experiences/${expId}`);
    if (url) {
      await addExperienceImage({
        experience_id: expId,
        src: url,
        position: "center center",
        sort_order: 0
      });
      toast.success("Image uploaded!", { id: "upload" });
      loadData();
    } else {
      toast.error("Failed to upload image", { id: "upload" });
    }
    setUploadingImage(false);
    e.target.value = "";
  }

  function handleImageDelete(imgId: number, url: string) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-white">Delete this image?</p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-4 py-1.5 text-xs bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteExperienceImage(imgId);
              await deleteImage(url);
              toast.success("Image deleted");
              loadData();
            }} 
            className="px-4 py-1.5 text-xs bg-red-500 rounded-lg hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' } });
  }

  if (loading && experiences.length === 0) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Experiences Management</h1>
          <p className="text-zinc-400">Manage your work history, organizations, and committees.</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="glass-card p-12 text-center text-zinc-500 flex flex-col items-center">
            <Briefcase size={48} className="mb-4 text-zinc-600" />
            <p>No experiences added yet.</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="glass-card p-6 border border-white/5 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <p className="text-violet-400 font-medium">{exp.organization}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(exp)} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
                    <span className="capitalize px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                      {exp.type}
                    </span>
                    <span>
                      {exp.start_date ? new Date(exp.start_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "?"} 
                      {" - "} 
                      {exp.end_date ? new Date(exp.end_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : <span className="text-green-400 font-medium">Present</span>}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">{exp.description}</p>
                </div>

                {/* Images Section */}
                <div className="w-full md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-zinc-400">Gallery ({exp.experience_images?.length || 0})</h4>
                    <label className="cursor-pointer text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md transition-colors">
                      {uploadingImage ? "..." : "+ Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, exp.id)} disabled={uploadingImage} />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {exp.experience_images?.map((img) => (
                      <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group/img">
                        <Image src={img.src} alt="" fill className="object-cover" />
                        <button
                          onClick={() => handleImageDelete(img.id, img.src)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white text-xs font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-[modalIn_0.3s_ease]">
            <h2 className="text-2xl font-bold text-white mb-6">
              {formData.id ? "Edit Experience" : "Add Experience"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title / Role</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50" placeholder="e.g. Frontend Developer" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Organization</label>
                  <input type="text" required value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50" placeholder="e.g. Google" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="radio" name="type" value="organization" checked={formData.type === "organization"} onChange={() => setFormData({...formData, type: "organization"})} className="text-violet-500 focus:ring-violet-500/50" />
                    Professional / Organization
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="radio" name="type" value="committee" checked={formData.type === "committee"} onChange={() => setFormData({...formData, type: "committee"})} className="text-violet-500 focus:ring-violet-500/50" />
                    Committee / Event
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Start Date</label>
                  <input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 scheme-dark" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">End Date</label>
                    <label className="text-xs text-violet-400 flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} className="rounded text-violet-500 focus:ring-violet-500/50" />
                      Present / Ongoing
                    </label>
                  </div>
                  <input type="date" disabled={isCurrent} value={formData.end_date || ""} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 scheme-dark" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea rows={5} value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 resize-y" placeholder="- Developed web apps...&#10;- Led a team of..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
