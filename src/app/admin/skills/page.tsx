"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Skill = {
  id: number;
  name: string;
  category: string;
  sort_order: number;
};

const CATEGORIES = ["Frontend", "Backend & AI", "Tools & Others"];

function SortableSkillItem({ skill, onDelete }: { skill: Skill; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-black/40 border border-white/10 hover:border-violet-500/40 text-sm text-zinc-300 pl-1 pr-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white p-1 text-zinc-500 active:cursor-grabbing">
        <GripVertical size={14} />
      </div>
      <span className="whitespace-nowrap">{skill.name}</span>
      <button
        onClick={() => onDelete(skill.id)}
        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all ml-1"
        title="Delete skill"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: CATEGORIES[0] });
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  useEffect(() => {
    (async () => {
      await fetchSkills();
    })();
  }, []);

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    
    setSaving(true);
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
      setNewSkill({ name: "", category: newSkill.category });
      setIsAdding(false);
      fetchSkills();
    }
    setSaving(false);
  }

  function handleDeleteSkill(id: number) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-white">Delete this skill?</p>
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
              const { error } = await supabase.from("skills").delete().eq("id", id);
              if (error) {
                toast.error(error.message);
              } else {
                toast.success("Skill deleted");
                setSkills(skills.filter((s) => s.id !== id));
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

  async function handleDragEnd(event: DragEndEvent, category: string) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const categorySkills = skills.filter(s => s.category === category);
    const oldIndex = categorySkills.findIndex((s) => s.id === active.id);
    const newIndex = categorySkills.findIndex((s) => s.id === over.id);

    // Create the new array for this category
    const reorderedCategorySkills = arrayMove(categorySkills, oldIndex, newIndex);

    // Map to assign new sort_order (0, 1, 2, ...)
    const updates = reorderedCategorySkills.map((skill, index) => ({
      id: skill.id,
      sort_order: index,
    }));

    // Optimistically update the UI
    setSkills((prev) => {
      const newSkills = [...prev];
      updates.forEach((update) => {
        const item = newSkills.find(s => s.id === update.id);
        if (item) item.sort_order = update.sort_order;
      });
      // Sort immediately so the UI snaps perfectly
      return newSkills.sort((a, b) => a.sort_order - b.sort_order);
    });

    // Save to database
    try {
      // Supabase doesn't have bulk update easily with different values, so we loop
      // (For 10-20 skills, this is very fast)
      await Promise.all(
        updates.map((update) =>
          supabase.from("skills").update({ sort_order: update.sort_order }).eq("id", update.id)
        )
      );
      toast.success("Order saved", { id: "reorder" });
    } catch {
      toast.error("Failed to save new order");
      fetchSkills(); // rollback
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
          const catSkills = skills.filter((s) => s.category === category).sort((a,b) => a.sort_order - b.sort_order);
          
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, category)}
                >
                  <SortableContext items={catSkills} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <SortableSkillItem key={skill.id} skill={skill} onDelete={handleDeleteSkill} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
