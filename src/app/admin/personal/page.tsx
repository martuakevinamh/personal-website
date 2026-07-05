"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage, deleteImage } from "@/lib/storage";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Trash2, Move } from "lucide-react";
import React, { useRef } from "react";

type PersonalData = {
  id: number;
  name: string;
  role: string;
  bio: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  resume_url: string;
  status: string;
  profile_images: { src: string; position?: string; zoom?: number }[];
  stats: { label: string; value: string }[];
};

function DraggableProfileImage({
  img,
  index,
  onUpdate,
  onRemove
}: {
  img: { src: string; position?: string; zoom?: number };
  index: number;
  onUpdate: (index: number, field: "position" | "zoom", value: string | number) => void;
  onRemove: (src: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Parse position "50% 50%" or default
  const posStr = img.position || "50% 50%";
  const [posX, posY] = posStr.split(" ").map(p => parseFloat(p) || 50);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent text selection/scrolling
    const startX = e.clientX;
    const startY = e.clientY;
    
    const initialPosX = posX;
    const initialPosY = posY;
    
    setIsDragging(true);
    
    // Using window events so it doesn't stop if mouse leaves the container
    const handlePointerMove = (ev: PointerEvent) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      
      // Sensitivity factor - smaller means slower drag
      const sensitivity = 0.2 / (img.zoom || 1);
      
      let newX = initialPosX - (deltaX * sensitivity);
      let newY = initialPosY - (deltaY * sensitivity);
      
      // Clamp between 0 and 100
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
      
      onUpdate(index, "position", `${newX.toFixed(2)}% ${newY.toFixed(2)}%`);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleDoubleClick = () => {
    onUpdate(index, "position", "50% 50%");
    onUpdate(index, "zoom", 1);
  };

  return (
    <div className="flex flex-col gap-2 shrink-0 border border-white/10 rounded-xl p-3 bg-black/20 w-48">
      <div 
        ref={containerRef}
        className={`relative w-full aspect-square rounded-lg overflow-hidden group touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to position, Double-click to reset"
      >
        <Image 
          src={img.src} 
          alt={`Profile ${index}`} 
          fill 
          className="object-cover pointer-events-none" 
          style={{
            objectPosition: img.position || "50% 50%",
            transformOrigin: img.position || "50% 50%",
            transform: `scale(${img.zoom || 1})`
          }}
        />
        
        {/* Rule of Thirds Grid */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 flex ${isDragging ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-1/3 left-0 w-full h-px bg-white/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-white/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/40 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Overlay instructions & remove button */}
        <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 ${isDragging ? 'hidden' : ''}`}>
          <div className="flex items-center gap-1 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full pointer-events-none">
            <Move size={12} /> Drag to position
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(img.src); }}
            className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors pointer-events-auto"
          >
            Remove
          </button>
        </div>
      </div>
      
      {/* Zoom Control */}
      <div className="space-y-1 mt-2 text-xs">
        <label className="text-zinc-400 font-semibold uppercase tracking-wide flex justify-between">
          Zoom <span>{img.zoom || 1}x</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="3" 
          step="0.05" 
          value={img.zoom || 1}
          onChange={(e) => onUpdate(index, "zoom", parseFloat(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>
    </div>
  );
}

export default function AdminPersonal() {
  const [data, setData] = useState<Partial<PersonalData>>({
    profile_images: [],
    stats: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function fetchPersonal() {
    const { data: res, error } = await supabase.from("personal").select("*").maybeSingle();
    if (error) {
      toast.error("Failed to fetch data");
    } else if (res) {
      setData({
        ...res,
        profile_images: res.profile_images || [],
        stats: res.stats || [],
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await fetchPersonal();
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value && !/^https?:\/\//i.test(value)) {
      setData((prev) => ({ ...prev, [name]: `https://${value}` }));
    }
  };

  // --- STATS MANAGEMENT ---
  const handleAddStat = () => {
    setData((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), { label: "", value: "" }],
    }));
  };

  const handleStatChange = (index: number, field: "label" | "value", value: string) => {
    const newStats = [...(data.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setData((prev) => ({ ...prev, stats: newStats }));
  };

  const handleRemoveStat = (index: number) => {
    const newStats = [...(data.stats || [])];
    newStats.splice(index, 1);
    setData((prev) => ({ ...prev, stats: newStats }));
  };

  // --- IMAGES MANAGEMENT ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    toast.loading("Uploading image...", { id: "upload" });

    const url = await uploadImage(file, "profile");
    if (url) {
      setData((prev) => ({
        ...prev,
        profile_images: [...(prev.profile_images || []), { src: url, position: "center", zoom: 1 }],
      }));
      toast.success("Image uploaded! Don't forget to save.", { id: "upload" });
    } else {
      toast.error("Failed to upload image", { id: "upload" });
    }
    setUploadingImage(false);
    e.target.value = "";
  };

  const handleImageRemove = (urlToRemove: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-white">Are you sure you want to remove this image?</p>
        <div className="flex gap-2 justify-end">
          <button 
            type="button"
            onClick={() => toast.dismiss(t.id)} 
            className="px-4 py-1.5 text-xs bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteImage(urlToRemove);
              setData((prev) => ({
                ...prev,
                profile_images: (prev.profile_images || []).filter(img => img.src !== urlToRemove),
              }));
              toast.success("Image removed");
            }} 
            className="px-4 py-1.5 text-xs bg-red-500 rounded-lg hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20"
          >
            Remove
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, 
      id: "confirm-delete",
      style: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' } 
    });
  };

  const handleImageUpdate = (index: number, field: "position" | "zoom", value: string | number) => {
    const newImages = [...(data.profile_images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    setData((prev) => ({ ...prev, profile_images: newImages }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (data.id) {
        const { error } = await supabase.from("personal").update(data).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("personal").insert(data);
        if (error) throw error;
      }
      toast.success("Personal data saved successfully!");
      fetchPersonal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save data");
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl animate-[fadeIn_0.5s_ease] pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Personal Data</h1>
        <p className="text-zinc-400">Manage your basic profile information, photos, and stats displayed across the website.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* --- Profile Images Section --- */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Profile Images</h2>
              <p className="text-sm text-zinc-400">These images will rotate in the About section.</p>
            </div>
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              {uploadingImage ? "Uploading..." : <><Plus size={16} /> Add Image</>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {(data.profile_images || []).length === 0 ? (
              <div className="w-full py-8 text-center text-zinc-500 text-sm border border-dashed border-white/10 rounded-xl">
                No profile images uploaded yet.
              </div>
            ) : (
              (data.profile_images || []).map((img, i) => (
                <DraggableProfileImage
                  key={i}
                  img={img}
                  index={i}
                  onUpdate={handleImageUpdate}
                  onRemove={handleImageRemove}
                />
              ))
            )}
          </div>
        </div>

        {/* --- Stats Section --- */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Profile Stats</h2>
              <p className="text-sm text-zinc-400">Short highlights like &quot;10+ Projects&quot;.</p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {(data.stats || []).length === 0 ? (
              <div className="w-full py-6 text-center text-zinc-500 text-sm border border-dashed border-white/10 rounded-xl">
                No stats added yet.
              </div>
            ) : (
              (data.stats || []).map((stat, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(i, "value", e.target.value)}
                    placeholder="Value (e.g. 10+)"
                    className="w-1/3 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-violet-500/50"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(i, "label", e.target.value)}
                    placeholder="Label (e.g. Projects)"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(i)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Basic Info Section --- */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
              <input
                name="name"
                type="text"
                required
                value={data.name || ""}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                placeholder="e.g. Martua Kevin"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role / Title</label>
              <input
                name="role"
                type="text"
                required
                value={data.role || ""}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                placeholder="e.g. Full Stack Developer"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Status</label>
            <input
              name="status"
              type="text"
              required
              value={data.status || ""}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
              placeholder="e.g. Open to work"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Bio</label>
            <textarea
              name="bio"
              rows={4}
              required
              value={data.bio || ""}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 resize-y"
              placeholder="Tell something about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</label>
              <input
                name="location"
                type="text"
                value={data.location || ""}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                placeholder="e.g. Bandar Lampung, Indonesia"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
              <input
                name="email"
                type="email"
                value={data.email || ""}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
                placeholder="e.g. you@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub URL</label>
              <input
                name="github_url"
                type="url"
                value={data.github_url || ""}
                onChange={handleChange}
                onBlur={handleUrlBlur}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 text-sm"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">LinkedIn URL</label>
              <input
                name="linkedin_url"
                type="url"
                value={data.linkedin_url || ""}
                onChange={handleChange}
                onBlur={handleUrlBlur}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 text-sm"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Instagram URL</label>
              <input
                name="instagram_url"
                type="url"
                value={data.instagram_url || ""}
                onChange={handleChange}
                onBlur={handleUrlBlur}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Resume URL (Optional)</label>
            <input
              name="resume_url"
              type="url"
              value={data.resume_url || ""}
              onChange={handleChange}
              onBlur={handleUrlBlur}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500/50"
              placeholder="Link to your CV/Resume (Google Drive, etc)"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
          >
            {saving ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
