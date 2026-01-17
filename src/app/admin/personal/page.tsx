"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function PersonalPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    role: "", // Mapped to 'title' in frontend
    bio: "",
    location: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    instagram_url: "",
    resume_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("personal")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is "The result contains 0 rows"
        console.error("Error fetching personal info:", error);
      }

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      toast.error("Error loading data: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Saving personal info...");

    try {
      // Upsert: update if exists, insert if not
      // We assume there's only one row for personal info
      const payload = { ...formData };
      if (payload.id === 0) {
        // @ts-expect-error: Deleting ID to allow auto-increment on insert
        delete payload.id;
      }

      const { error } = await supabase
        .from("personal")
        .upsert(payload);

      if (error) throw error;
      
      toast.dismiss(loadingToast);
      toast.success("Personal info saved successfully!");
      fetchData(); // Refresh to get ID if it was new
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error saving: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Personal Info</h1>

      <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Role / Title</label>
            <input
              type="text"
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Bio</label>
            <textarea
              rows={4}
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <h3 className="text-lg font-bold mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url || ""}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url || ""}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram_url || ""}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Resume / CV URL</label>
            <input
              type="text"
              value={formData.resume_url || ""}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary py-3 flex items-center justify-center font-bold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
