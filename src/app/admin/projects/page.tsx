"use client";

import { useState, useEffect } from "react";
import { getProjects, createProject, updateProject, deleteProject, addProjectImage, deleteProjectImage } from "@/lib/queries/projects";
import { uploadImage, deleteImage } from "@/lib/storage";
import { ProjectWithImages, ProjectPayload } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, FolderGit2, Edit2, Trash2, Star, Move } from "lucide-react";
import React, { useRef } from "react";
import { ProjectImage } from "@/lib/types";

function DraggableProjectImage({
  img,
  onSave,
  onRemove
}: {
  img: ProjectImage;
  onSave: (id: number, field: "position" | "zoom", value: string | number) => void;
  onRemove: (id: number, src: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState(img.position || "50% 50%");
  const [localZoom, setLocalZoom] = useState(img.zoom || 1);
  
  const [posX, posY] = localPos.split(" ").map(p => parseFloat(p) || 50);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPosX = posX;
    const initialPosY = posY;
    
    let currentNewPos = localPos;

    const handlePointerMove = (ev: PointerEvent) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      const sensitivity = 0.2 / localZoom;
      
      let newX = initialPosX - (deltaX * sensitivity);
      let newY = initialPosY - (deltaY * sensitivity);
      
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
      
      currentNewPos = `${newX.toFixed(2)}% ${newY.toFixed(2)}%`;
      setLocalPos(currentNewPos);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      onSave(img.id, "position", currentNewPos);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="flex flex-col gap-2 shrink-0 border border-white/10 rounded-xl p-2 bg-black/20 w-48">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden group cursor-move touch-none"
        onPointerDown={handlePointerDown}
      >
        <Image 
          src={img.src} 
          alt="" 
          fill 
          className="object-cover pointer-events-none" 
          style={{
            objectPosition: localPos,
            transform: `scale(${localZoom})`
          }}
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-1 text-white text-[10px] font-medium bg-black/50 px-2 py-1 rounded-full pointer-events-none">
            <Move size={10} /> Drag
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(img.id, img.src); }}
            className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-md hover:bg-red-600 transition-colors pointer-events-auto"
          >
            Del
          </button>
        </div>
      </div>
      
      {/* Zoom Control */}
      <div className="space-y-1 mt-1 text-[10px]">
        <label className="text-zinc-400 font-semibold uppercase tracking-wide flex justify-between">
          Zoom <span>{localZoom}x</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="3" 
          step="0.05" 
          value={localZoom}
          onChange={(e) => setLocalZoom(parseFloat(e.target.value))}
          onMouseUp={(e) => onSave(img.id, "zoom", parseFloat((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => onSave(img.id, "zoom", parseFloat((e.target as HTMLInputElement).value))}
          className="w-full accent-violet-500"
        />
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ProjectPayload> & { id?: number }>({
    title: "",
    description: "",
    tags: [],
    demo_url: "",
    github_url: "",
    featured: false,
    status: "ongoing",
  });
  
  const [tagInput, setTagInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  async function loadData() {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  function handleEdit(proj: ProjectWithImages) {
    setFormData({
      id: proj.id,
      title: proj.title,
      description: proj.description || "",
      tags: proj.tags || [],
      demo_url: proj.demo_url || "",
      github_url: proj.github_url || "",
      featured: proj.featured,
      status: proj.status as "ongoing" | "completed",
    });
    setTagInput("");
    setIsModalOpen(true);
  }

  function handleNew() {
    setFormData({
      title: "",
      description: "",
      tags: [],
      demo_url: "",
      github_url: "",
      featured: false,
      status: "ongoing",
    });
    setTagInput("");
    setIsModalOpen(true);
  }

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>, fieldName: keyof ProjectPayload) => {
    const { value } = e.target;
    if (value && !/^https?:\/\//i.test(value)) {
      setFormData((prev) => ({ ...prev, [fieldName]: `https://${value}` }));
    }
  };

  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      }
      setTagInput("");
    }
  }

  function removeTag(tagToRemove: string) {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const payload: ProjectPayload = {
      title: formData.title!,
      description: formData.description || "",
      tags: formData.tags || [],
      demo_url: formData.demo_url || null,
      github_url: formData.github_url || null,
      featured: formData.featured || false,
      status: formData.status as "ongoing" | "completed",
    };

    try {
      if (formData.id) {
        await updateProject(formData.id, payload);
        toast.success("Project updated!");
      } else {
        await createProject(payload);
        toast.success("Project added!");
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
        <p className="text-sm font-medium text-white">Delete this project and all its images?</p>
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
              const ok = await deleteProject(id);
              if (ok) {
                toast.success("Project deleted");
                loadData();
              } else {
                toast.error("Failed to delete project");
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, projId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    toast.loading("Uploading image...", { id: "upload" });
    
    const url = await uploadImage(file, `projects/${projId}`);
    if (url) {
      await addProjectImage({
        project_id: projId,
        src: url,
        position: "center center",
        sort_order: 0,
        zoom: 1
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
              await deleteProjectImage(imgId);
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

  // Save image position or zoom changes to database
  async function handleImageSave(imgId: number, field: "position" | "zoom", value: string | number) {
    try {
      const { updateProjectImage } = await import("@/lib/queries/projects");
      await updateProjectImage(imgId, { [field]: value });
      toast.success("Image updated", { id: "img-update", duration: 1500 });
      // Update local state to avoid full reload just for a style tweak
      setProjects(prev => prev.map(proj => ({
        ...proj,
        project_images: (proj.project_images || []).map(img => 
          img.id === imgId ? { ...img, [field]: value } : img
        )
      })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image", { id: "img-update" });
    }
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-[fadeIn_0.5s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
          <p className="text-zinc-400">Add and update your portfolio projects and their image galleries.</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] flex items-center gap-2"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-zinc-500 flex flex-col items-center">
            <FolderGit2 size={48} className="mb-4 text-zinc-600" />
            <p>No projects added yet.</p>
          </div>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="glass-card p-6 border border-white/5 relative flex flex-col">
              {proj.featured && (
                <div className="absolute -top-3 -right-3 bg-amber-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)] z-10">
                  FEATURED
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${proj.status === 'completed' ? 'bg-violet-500/20 text-violet-400' : 'bg-green-500/20 text-green-400'}`}>
                      {proj.status?.toUpperCase() || ''}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(proj)} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Edit details">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(proj.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete project">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1">{proj.description}</p>

              {/* Gallery Manager inside card */}
              <div className="mt-auto border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-500">IMAGE GALLERY ({proj.project_images?.length || 0})</span>
                  <label className="cursor-pointer text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md transition-colors">
                    {uploadingImage ? "..." : "+ Add Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, proj.id)} disabled={uploadingImage} />
                  </label>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {proj.project_images?.map(img => (
                    <DraggableProjectImage
                      key={img.id}
                      img={img}
                      onSave={handleImageSave}
                      onRemove={handleImageDelete}
                    />
                  ))}
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
              {formData.id ? "Edit Project" : "Add Project"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50" placeholder="e.g. Portfolio V2" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea rows={4} value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 resize-y" placeholder="Describe the project..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tags (Press Enter to add)</label>
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-violet-500/50 flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs text-white">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 ml-1">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="bg-transparent border-none outline-none text-white text-sm min-w-30 flex-1"
                    placeholder="e.g. Next.js"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Demo URL</label>
                  <input type="url" value={formData.demo_url || ""} onBlur={(e) => handleUrlBlur(e, 'demo_url')} onChange={(e) => setFormData({...formData, demo_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 text-sm" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub Repo URL</label>
                  <input type="url" value={formData.github_url || ""} onBlur={(e) => handleUrlBlur(e, 'github_url')} onChange={(e) => setFormData({...formData, github_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 text-sm" placeholder="https://github.com/..." />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 pt-2">
                <label className="flex items-center gap-3 p-4 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-violet-500/30 transition-colors">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded text-violet-500 focus:ring-violet-500/50" />
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">Featured Project <Star size={14} className="text-amber-500 fill-amber-500" /></div>
                    <div className="text-xs text-zinc-400">Showcases prominently</div>
                  </div>
                </label>
                
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.status === 'ongoing' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-black/40 border-white/10 text-zinc-400'}`}>
                    <input type="radio" name="status" className="hidden" checked={formData.status === 'ongoing'} onChange={() => setFormData({...formData, status: 'ongoing'})} />
                    In Progress
                  </label>
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.status === 'completed' ? 'bg-violet-500/20 border-violet-500/50 text-violet-400' : 'bg-black/40 border-white/10 text-zinc-400'}`}>
                    <input type="radio" name="status" className="hidden" checked={formData.status === 'completed'} onChange={() => setFormData({...formData, status: 'completed'})} />
                    Completed
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
