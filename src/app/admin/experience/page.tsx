"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

type ExperienceImage = {
  id?: number;
  src: string;
  position: string;
  zoom: number;
};

type Experience = {
  id: number;
  title: string;
  organization: string;
  type: "organization" | "committee";
  start_date: string;
  end_date: string;
  description: string;
  images: ExperienceImage[];
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<Experience>({
    id: 0,
    title: "",
    organization: "",
    type: "organization",
    start_date: "",
    end_date: "",
    description: "",
    images: [],
  });

  const DRAFT_KEY = "admin_experience_draft";

  // Load draft from localStorage on mount
  useEffect(() => {
    fetchExperiences();
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        setShowForm(true);
        toast.success("Draft restored", { icon: "📝" });
      } catch { /* ignore invalid JSON */ }
    }
  }, []);

  // Auto-save draft to localStorage when formData changes
  useEffect(() => {
    if (showForm || editingId) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, showForm, editingId]);

  const fetchExperiences = async () => {
    setLoading(true);
    // Fetch experiences
    const { data: exps, error: expError } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (expError) {
      toast.error("Error fetching experiences: " + expError.message);
      setLoading(false);
      return;
    }

    // Fetch images for all experiences
    const { data: images, error: imgError } = await supabase
      .from("experience_images")
      .select("*")
      .order("sort_order");

      if (imgError) {
        toast.error("Error fetching images: " + imgError.message);
        setLoading(false);
        return;
      }

    // Combine data
    const combined = exps.map((e) => ({
      ...e,
      images: images?.filter((i) => i.experience_id === e.id)
        .map(i => ({ 
          src: i.src, 
          position: i.position, 
          id: i.id,
          zoom: i.zoom || 1 
        })) || [],
    }));

    setExperiences(combined);
    setLoading(false);
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData(exp);
    setShowForm(true); // Show form when editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      id: 0,
      title: "",
      organization: "",
      type: "organization",
      start_date: "",
      end_date: "",
      description: "",
      images: [],
    });
    localStorage.removeItem(DRAFT_KEY); // Clear draft
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { src: "", position: "center center", zoom: 1 }],
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleImageChange = (index: number, field: "src" | "position" | "zoom", value: string | number) => {
    const newImages = [...formData.images];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newImages[index] = { ...newImages[index], [field]: value } as any; 
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(editingId ? "Updating..." : "Creating...");
    
    try {
      // 1. Upsert Experience
      const expPayload: {
        id?: number;
        title: string;
        organization: string;
        type: "organization" | "committee";
        start_date: string | null;
        end_date: string | null;
        description: string;
      } = {
        title: formData.title,
        organization: formData.organization,
        type: formData.type,
        start_date: formData.start_date || null, // Handle empty date
        end_date: formData.end_date || null,
        description: formData.description,
      };

      if (editingId) expPayload.id = editingId;

      const { data: savedExp, error: expError } = await supabase
        .from("experiences")
        .upsert(expPayload)
        .select()
        .single();

      if (expError) throw expError;

      // 2. Handle Images
      // Simplified strategy: Delete all images for this ID and re-insert
      if (savedExp) {
        // Delete old
        await supabase.from("experience_images").delete().eq("experience_id", savedExp.id);

        // Insert new
        if (formData.images.length > 0) {
          const imagesPayload = formData.images.map((img, idx) => ({
            experience_id: savedExp.id,
            src: img.src,
            position: img.position,
            zoom: img.zoom, // Save zoom
            sort_order: idx,
          }));
          const { error: imgError } = await supabase.from("experience_images").insert(imagesPayload);
          if (imgError) throw imgError;
        }
      }

      toast.dismiss(loadingToast);
      toast.success("Experience saved successfully!");
      handleCancel(); // Reset and hide form
      fetchExperiences();

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error saving: " + (error as Error).message);
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    const loadingToast = toast.loading("Deleting...");
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", deletingId);
      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success("Experience deleted!");
      fetchExperiences();
    } catch (error) {
       toast.dismiss(loadingToast);
       toast.error("Error deleting: " + (error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Manage Experience</h1>
        {!showForm && !editingId && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <span>+</span> Add New Experience
          </button>
        )}
      </div>

       <ConfirmModal 
        isOpen={!!deletingId}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />

      {/* Form */}
      {(showForm || editingId) && (
        <div className="glass-card p-6 mb-10 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? "Edit Experience" : "Add New Experience"}</h3>
            <button onClick={handleCancel} className="text-zinc-500 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Organization</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "organization" | "committee" })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                >
                  <option value="organization">Organization</option>
                  <option value="committee">Committee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                <input
                  type="date" // Using DATE input as requested
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
                <p className="text-xs text-zinc-500 mt-1">Leave empty for &quot;Present&quot;</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
              />
            </div>

            {/* Images Section */}
            <div className="border border-zinc-800 rounded-xl p-4 bg-black/20">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Images</h4>
                <button type="button" onClick={handleAddImage} className="text-sm btn-ghost px-3 py-1 bg-zinc-800 rounded">
                  + Add Image
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-4 items-start bg-zinc-900/50 p-3 rounded-lg">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">Image</label>
                        <label className={`
                          flex items-center justify-center w-full px-4 py-2 rounded-lg cursor-pointer transition-colors border border-dashed
                          ${img.src ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-violet-500/10 border-violet-500/50 hover:bg-violet-500/20 text-violet-300'}
                        `}>
                          <span className="text-sm font-medium">
                            {img.src ? "🔄 Change Image" : "📤 Upload Image"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const url = await uploadImage(file, "experiences");
                              if (url) {
                                handleImageChange(index, "src", url);
                              } else {
                                toast.error("Failed to upload image");
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">Position & Zoom</label>
                        <ImagePositionPicker
                          value={img.position}
                          imageUrl={img.src}
                          zoom={img.zoom || 1}
                          onZoomChange={(val) => handleImageChange(index, "zoom", val)}
                          onChange={(val: string) => handleImageChange(index, "position", val)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-400 mt-8"
                      title="Remove Image"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                {formData.images.length === 0 && <p className="text-sm text-zinc-500 italic">No images added</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-primary py-3">
                {editingId ? "Update Experience" : "Create Experience"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">{exp.title}</h4>
              <p className="text-sm text-zinc-400">{exp.organization}</p>
              <div className="flex gap-2 text-xs mt-2">
                <span className="bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded uppercase">{exp.type}</span>
                <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{exp.start_date} - {exp.end_date || "Present"}</span>
                <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{exp.images.length} images</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-zinc-800 rounded">✏️</button>
              <button 
                onClick={() => confirmDelete(exp.id)} 
                className="p-2 hover:bg-red-900/30 text-red-400 rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
