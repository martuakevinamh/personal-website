"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Project = {
  id: number;
  title: string;
  description: string;
  image_src: string;
  image_position: string;
  tags: string[];
  demo_url: string;
  github_url: string;
  featured: boolean;
  status: "ongoing" | "completed";
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: "",
    description: "",
    image_src: "",
    image_position: "center center",
    tags: [],
    demo_url: "",
    github_url: "",
    featured: false,
    status: "ongoing",
  });
  
  // Helper for tags input
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
       toast.error("Error fetching projects: " + error.message);
    } else {
       setProjects(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setTagsInput(project.tags ? project.tags.join(", ") : "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      id: 0,
      title: "",
      description: "",
      image_src: "",
      image_position: "center center",
      tags: [],
      demo_url: "",
      github_url: "",
      featured: false,
      status: "ongoing",
    });
    setTagsInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading(editingId ? "Updating..." : "Creating...");

    try {
      const payload: {
        id?: number;
        title: string;
        description: string;
        image_src: string;
        image_position: string;
        tags: string[];
        demo_url: string;
        github_url: string;
        featured: boolean;
        status: "ongoing" | "completed";
      } = {
        title: formData.title,
        description: formData.description,
        image_src: formData.image_src,
        image_position: formData.image_position,
        tags: tagsInput.split(",").map(t => t.trim()).filter(t => t),
        demo_url: formData.demo_url,
        github_url: formData.github_url,
        featured: formData.featured,
        status: formData.status,
      };

      if (editingId) payload.id = editingId;

      const { error } = await supabase
        .from("projects")
        .upsert(payload);

      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success("Project saved successfully!");
      handleCancel();
      fetchProjects();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error saving: " + (error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const loadingToast = toast.loading("Deleting...");
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deletingId);
      if (error) throw error;
      
      toast.dismiss(loadingToast);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
       toast.dismiss(loadingToast);
       toast.error("Error deleting: " + (error as Error).message);
    } finally {
      setDeletingId(null); // Close modal
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Manage Projects</h1>
        {!showForm && !editingId && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <span>+</span> Add New Project
          </button>
        )}
      </div>

       <ConfirmModal 
        isOpen={!!deletingId}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />

      {/* Form */}
      {(showForm || editingId) && (
        <div className="glass-card p-6 mb-10 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? "Edit Project" : "Add New Project"}</h3>
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
                <label className="block text-sm text-zinc-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "ongoing" | "completed" })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
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

            {/* Image Section */}
            <div className="bg-zinc-900/50 p-4 rounded-lg flex gap-6">
              <div className="flex-1">
                <label className="block text-sm text-zinc-400 mb-1">Image</label>
                <label className={`
                  flex items-center justify-center w-full px-4 py-2 rounded-lg cursor-pointer transition-colors border border-dashed
                  ${formData.image_src ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-violet-500/10 border-violet-500/50 hover:bg-violet-500/20 text-violet-300'}
                `}>
                  <span className="text-sm font-medium">
                    {formData.image_src ? "🔄 Change Image" : "📤 Upload Image"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const url = await uploadImage(file, "projects");
                      if (url) {
                        setFormData({ ...formData, image_src: url });
                      } else {
                        toast.error("Failed to upload image");
                      }
                    }}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Image Focus Position</label>
                <ImagePositionPicker
                  value={formData.image_position}
                  imageUrl={formData.image_src}
                  zoom={1}
                  onZoomChange={() => {}}
                  onChange={(val) => setFormData({ ...formData, image_position: val })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                placeholder="Next.js, TypeScript, Tailwind"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Demo URL</label>
                <input
                  type="text"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-violet-500 focus:ring-violet-500"
              />
              <label htmlFor="featured" className="text-sm text-zinc-300">Featured Project (Show on Home)</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 btn-primary py-3">
                {editingId ? "Update Project" : "Create Project"}
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
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-card p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-lg">{project.title}</h4>
                 <span className={`text-xs px-2 py-1 rounded ${project.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {project.status}
                 </span>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags?.map((t, i) => (
                    <span key={i} className="text-xs bg-zinc-800 text-zinc-500 px-1 rounded">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
              <button onClick={() => handleEdit(project)} className="text-violet-400 text-sm hover:underline">Edit</button>
              <button onClick={() => setDeletingId(project.id)} className="text-red-400 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
